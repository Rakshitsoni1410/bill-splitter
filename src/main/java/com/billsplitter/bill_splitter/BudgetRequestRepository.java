package com.billsplitter.bill_splitter;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BudgetRequestRepository extends JpaRepository<BudgetIncreaseRequest, Long> {
    List<BudgetIncreaseRequest> findByGroupIdAndStatus(Long groupId, BudgetIncreaseRequest.Status status);
}