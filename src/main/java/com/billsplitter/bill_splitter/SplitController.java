package com.billsplitter.bill_splitter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.Data;
import java.util.*;

@RestController
@RequestMapping("/api/splits")
public class SplitController {

    @Autowired
    private SplitService splitService;

    @PostMapping("/create")
    public ResponseEntity<?> createSplits(@RequestBody SplitRequest request) {
        List<ExpenseSplit> splits = splitService.createSplits(
            request.getExpenseId(),
            request.getPercentages(),
            request.getExactAmounts()
        );
        return ResponseEntity.ok(splits);
    }

    @GetMapping("/balances/{groupId}")
    public ResponseEntity<?> getBalances(@PathVariable Long groupId) {
        return ResponseEntity.ok(splitService.calculateBalances(groupId));
    }

    @PostMapping("/settle/{splitId}")
    public ResponseEntity<?> settle(@PathVariable Long splitId) {
        splitService.settleSplit(splitId);
        return ResponseEntity.ok("Settled successfully!");
    }

    @Data
    static class SplitRequest {
        private Long expenseId;
        private Map<Long, Double> percentages;
        private Map<Long, Double> exactAmounts;
    }
}