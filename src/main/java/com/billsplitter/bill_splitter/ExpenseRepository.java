package com.billsplitter.bill_splitter;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByGroupId(Long groupId);
    List<Expense> findByGroupIdAndCategory(Long groupId, Expense.Category category);
}