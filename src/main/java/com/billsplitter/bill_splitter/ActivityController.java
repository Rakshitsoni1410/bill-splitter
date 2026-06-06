package com.billsplitter.bill_splitter;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    @Autowired
    private ActivityRepository activityRepository;

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<Activity>> getGroupActivities(@PathVariable Long groupId) {
        return ResponseEntity.ok(activityRepository.findByGroupIdOrderByCreatedAtDesc(groupId));
    }

    @GetMapping("/group/{groupId}/recent")
    public ResponseEntity<List<Activity>> getRecentActivities(@PathVariable Long groupId) {
        return ResponseEntity.ok(activityRepository.findTop10ByGroupIdOrderByCreatedAtDesc(groupId));
    }
}