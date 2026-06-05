package com.billsplitter.bill_splitter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.Data;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addExpense(@RequestBody ExpenseRequest request) {
        Group group = groupRepository.findById(request.getGroupId())
                .orElse(null);
        if (group == null)
            return ResponseEntity.badRequest().body("Group not found!");

        User paidBy = userRepository.findById(request.getPaidById())
                .orElse(null);
        if (paidBy == null)
            return ResponseEntity.badRequest().body("User not found!");
        if (group.getBudgetLimit() != null) {
            double newTotal = group.getTotalSpent() + request.getAmount();
            if (newTotal > group.getBudgetLimit()) {
                double remaining = group.getBudgetLimit() - group.getTotalSpent();
                return ResponseEntity.badRequest().body(
                        "Budget exceeded! Remaining budget: ₹" + remaining +
                                ". Request a budget increase from the group creator.");
            }
            group.setTotalSpent(group.getTotalSpent() + request.getAmount());
            groupRepository.save(group);
        }

        Expense expense = new Expense();
        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setSplitType(request.getSplitType());
        expense.setPaidBy(paidBy);
        expense.setGroup(group);

        return ResponseEntity.ok(expenseRepository.save(expense));
    }

    @GetMapping("/group/{groupId}")
    public List<Expense> getGroupExpenses(@PathVariable Long groupId) {
        return expenseRepository.findByGroupId(groupId);
    }

    @GetMapping("/group/{groupId}/filter")
    public List<Expense> filterByCategory(@PathVariable Long groupId,
            @RequestParam Expense.Category category) {
        return expenseRepository.findByGroupIdAndCategory(groupId, category);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        expenseRepository.deleteById(id);
        return ResponseEntity.ok("Expense deleted!");
    }

    @Data
    static class ExpenseRequest {
        private String title;
        private Double amount;
        private Expense.Category category;
        private Expense.SplitType splitType;
        private Long groupId;
        private Long paidById;
    }

}