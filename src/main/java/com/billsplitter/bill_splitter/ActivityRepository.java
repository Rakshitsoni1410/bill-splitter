package com.billsplitter.bill_splitter;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByGroupIdOrderByCreatedAtDesc(Long groupId);
    List<Activity> findTop10ByGroupIdOrderByCreatedAtDesc(Long groupId);
}