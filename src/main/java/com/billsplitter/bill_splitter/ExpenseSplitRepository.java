package com.billsplitter.bill_splitter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, Long> {
    List<ExpenseSplit> findByExpenseId(Long expenseId);
    List<ExpenseSplit> findByUserIdAndIsSettled(Long userId, Boolean isSettled);

    @Query("SELECT s FROM ExpenseSplit s WHERE s.expense.group.id = :groupId AND s.isSettled = false")
    List<ExpenseSplit> findUnsettledByGroupId(Long groupId);
}