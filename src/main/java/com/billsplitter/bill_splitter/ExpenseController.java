package com.billsplitter.bill_splitter;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.Data;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityService activityService;

    @PostMapping("/add")
    public ResponseEntity<?> addExpense(@RequestBody ExpenseRequest request) {
        Group group = groupRepository.findById(request.getGroupId()).orElse(null);
        if (group == null)
            return ResponseEntity.badRequest().body("Group not found!");

        User paidBy = userRepository.findById(request.getPaidById()).orElse(null);
        if (paidBy == null)
            return ResponseEntity.badRequest().body("User not found!");

        if (group.getBudgetLimit() != null) {
            double currentSpent = group.getTotalSpent() != null ? group.getTotalSpent() : 0.0;
            double newTotal = currentSpent + request.getAmount();
            if (newTotal > group.getBudgetLimit()) {
                double remaining = group.getBudgetLimit() - currentSpent;
                return ResponseEntity.badRequest().body(
                        "Budget exceeded! Remaining budget: ₹" + remaining +
                                ". Request a budget increase from the group creator.");
            }
            group.setTotalSpent(currentSpent + request.getAmount());
            groupRepository.save(group);
        }

        Expense expense = new Expense();
        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setSplitType(request.getSplitType());
        expense.setPaidBy(paidBy);
        expense.setGroup(group);
        expenseRepository.save(expense);

        // Log activity
        activityService.log(group, paidBy, Activity.Type.EXPENSE_ADDED,
                paidBy.getName() + " added \"" + expense.getTitle() + "\" — ₹" + expense.getAmount());

        return ResponseEntity.ok(expense);
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
        Expense expense = expenseRepository.findById(id).orElse(null);
        if (expense == null)
            return ResponseEntity.badRequest().body("Expense not found!");

        // Log activity before deleting
        activityService.log(expense.getGroup(), expense.getPaidBy(),
                Activity.Type.EXPENSE_DELETED,
                expense.getPaidBy().getName() + " deleted \"" + expense.getTitle() + "\"");

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