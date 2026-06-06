package com.billsplitter.bill_splitter;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findBySenderIdOrReceiverId(Long senderId, Long receiverId);
    List<Transaction> findBySenderId(Long senderId);
    List<Transaction> findByReceiverId(Long receiverId);
}