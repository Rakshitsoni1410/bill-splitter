package com.billsplitter.bill_splitter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class BillSplitterApplication {

    public static void main(String[] args) {
        SpringApplication.run(BillSplitterApplication.class, args);
    }

    @GetMapping("/")
    public String home() {
        return "Bill Splitter API is running! 🚀";
    }
}