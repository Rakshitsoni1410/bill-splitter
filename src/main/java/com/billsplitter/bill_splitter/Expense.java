package com.billsplitter.bill_splitter;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "expenses")
@Data
public class Expense {

    public enum Category {
        FOOD, TRAVEL, RENT, SHOPPING, ENTERTAINMENT, OTHER
    }

    public enum SplitType {
        EQUAL, PERCENTAGE, EXACT
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private Double amount;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Enumerated(EnumType.STRING)
    private SplitType splitType;

    @ManyToOne
    @JoinColumn(name = "paid_by")
    private User paidBy;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;
}