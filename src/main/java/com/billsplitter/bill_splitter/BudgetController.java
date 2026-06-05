package com.billsplitter.bill_splitter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.Data;
import java.util.List;

@RestController
@RequestMapping("/api/budget")
public class BudgetController {

    @Autowired
    private BudgetRequestRepository budgetRequestRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    // Request budget increase
    @PostMapping("/request")
    public ResponseEntity<?> requestIncrease(@RequestBody IncreaseRequest request) {
        Group group = groupRepository.findById(request.getGroupId()).orElse(null);
        if (group == null) return ResponseEntity.badRequest().body("Group not found!");

        User user = userRepository.findById(request.getUserId()).orElse(null);
        if (user == null) return ResponseEntity.badRequest().body("User not found!");

        BudgetIncreaseRequest budgetRequest = new BudgetIncreaseRequest();
        budgetRequest.setGroup(group);
        budgetRequest.setRequestedBy(user);
        budgetRequest.setRequestedAmount(request.getRequestedAmount());
        budgetRequest.setReason(request.getReason());
        budgetRequest.setStatus(BudgetIncreaseRequest.Status.PENDING);

        return ResponseEntity.ok(budgetRequestRepository.save(budgetRequest));
    }

    // Get all pending requests for a group
    @GetMapping("/requests/{groupId}")
    public List<BudgetIncreaseRequest> getPendingRequests(@PathVariable Long groupId) {
        return budgetRequestRepository.findByGroupIdAndStatus(
            groupId, BudgetIncreaseRequest.Status.PENDING);
    }

    // Approve or reject
    @PutMapping("/requests/{requestId}/approve")
    public ResponseEntity<?> approve(@PathVariable Long requestId) {
        BudgetIncreaseRequest request = budgetRequestRepository.findById(requestId).orElse(null);
        if (request == null) return ResponseEntity.badRequest().body("Request not found!");

        // Update budget limit
        Group group = request.getGroup();
        group.setBudgetLimit(group.getBudgetLimit() + request.getRequestedAmount());
        groupRepository.save(group);

        request.setStatus(BudgetIncreaseRequest.Status.APPROVED);
        budgetRequestRepository.save(request);

        return ResponseEntity.ok("Budget increased to ₹" + group.getBudgetLimit());
    }

    @PutMapping("/requests/{requestId}/reject")
    public ResponseEntity<?> reject(@PathVariable Long requestId) {
        BudgetIncreaseRequest request = budgetRequestRepository.findById(requestId).orElse(null);
        if (request == null) return ResponseEntity.badRequest().body("Request not found!");

        request.setStatus(BudgetIncreaseRequest.Status.REJECTED);
        budgetRequestRepository.save(request);

        return ResponseEntity.ok("Request rejected!");
    }

    @Data
    static class IncreaseRequest {
        private Long groupId;
        private Long userId;
        private Double requestedAmount;
        private String reason;
    }
}