package com.billsplitter.bill_splitter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.Data;
import java.util.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ExpenseSplitRepository splitRepository;

    // Pay via UPI ID
    @PostMapping("/pay")
    public ResponseEntity<?> pay(@RequestBody PayRequest request) {
        User sender = userRepository.findById(request.getSenderId()).orElse(null);
        if (sender == null) return ResponseEntity.badRequest().body("Sender not found!");

        // Find receiver by UPI ID
        User receiver = userRepository.findByUpiId(request.getReceiverUpiId()).orElse(null);
        if (receiver == null) return ResponseEntity.badRequest().body("UPI ID not found!");

        // Check wallet balance
        double senderBalance = sender.getWalletBalance() != null ? sender.getWalletBalance() : 0.0;
        if (senderBalance < request.getAmount()) {
            return ResponseEntity.badRequest().body(
                "Insufficient wallet balance! Available: ₹" + senderBalance
            );
        }

        // Create transaction
        Transaction txn = new Transaction();
        txn.setSender(sender);
        txn.setReceiver(receiver);
        txn.setAmount(request.getAmount());
        txn.setNote(request.getNote());
        txn.setStatus(Transaction.Status.PENDING);
        transactionRepository.save(txn);

        // Simulate payment processing
        try {
            // Deduct from sender
            sender.setWalletBalance(senderBalance - request.getAmount());
            userRepository.save(sender);

            // Add to receiver
            double receiverBalance = receiver.getWalletBalance() != null ? receiver.getWalletBalance() : 0.0;
            receiver.setWalletBalance(receiverBalance + request.getAmount());
            userRepository.save(receiver);

            // Mark success
            txn.setStatus(Transaction.Status.SUCCESS);
            transactionRepository.save(txn);

            // Auto settle the split if splitId provided
            if (request.getSplitId() != null) {
                ExpenseSplit split = splitRepository.findById(request.getSplitId()).orElse(null);
                if (split != null) {
                    split.setIsSettled(true);
                    splitRepository.save(split);
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("status", "SUCCESS ✅");
            response.put("txnReference", txn.getUpiReference());
            response.put("amount", "₹" + request.getAmount());
            response.put("from", sender.getName());
            response.put("to", receiver.getName());
            response.put("remainingBalance", "₹" + sender.getWalletBalance());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            txn.setStatus(Transaction.Status.FAILED);
            transactionRepository.save(txn);
            return ResponseEntity.badRequest().body("Payment failed! Try again.");
        }
    }

    // Get transaction history
    @GetMapping("/history/{userId}")
    public ResponseEntity<?> getHistory(@PathVariable Long userId) {
        List<Transaction> txns = transactionRepository
            .findBySenderIdOrReceiverId(userId, userId);

        List<Map<String, Object>> history = new ArrayList<>();
        for (Transaction txn : txns) {
            Map<String, Object> map = new HashMap<>();
            map.put("txnReference", txn.getUpiReference());
            map.put("amount", "₹" + txn.getAmount());
            map.put("from", txn.getSender().getName());
            map.put("to", txn.getReceiver().getName());
            map.put("status", txn.getStatus());
            map.put("note", txn.getNote());
            map.put("time", txn.getCreatedAt());
            history.add(map);
        }
        return ResponseEntity.ok(history);
    }

    // Check wallet balance
    @GetMapping("/wallet/{userId}")
    public ResponseEntity<?> getWallet(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.badRequest().body("User not found!");

        Map<String, Object> response = new HashMap<>();
        response.put("name", user.getName());
        response.put("upiId", user.getUpiId());
        response.put("walletBalance", "₹" + user.getWalletBalance());
        return ResponseEntity.ok(response);
    }

    @Data
    static class PayRequest {
        private Long senderId;
        private String receiverUpiId;
        private Double amount;
        private String note;
        private Long splitId; // optional - auto settle split after payment
    }
}