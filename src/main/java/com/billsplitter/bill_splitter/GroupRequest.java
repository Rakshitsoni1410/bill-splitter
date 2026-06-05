package com.billsplitter.bill_splitter;

import lombok.Data;
import java.util.List;

@Data
public class GroupRequest {
    private String name;
    private Long createdById;
    private List<Long> memberIds;
}