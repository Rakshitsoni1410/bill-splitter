package com.billsplitter.bill_splitter;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByGroupId(Long groupId);
    List<Expense> findByGroupIdAndCategory(Long groupId, Expense.Category category);
}