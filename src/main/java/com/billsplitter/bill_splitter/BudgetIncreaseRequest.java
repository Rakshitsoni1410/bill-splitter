package com.billsplitter.bill_splitter;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "budget_requests")
@Data
public class BudgetIncreaseRequest {

    public enum Status {
        PENDING, APPROVED, REJECTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;

    @ManyToOne
    @JoinColumn(name = "requested_by")
    private User requestedBy;

    private Double requestedAmount;
    private String reason;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;
}