package com.billsplitter.bill_splitter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class SplitService {

    @Autowired
    private ExpenseSplitRepository splitRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ExpenseSplit> createSplits(Long expenseId,
                                            Map<Long, Double> percentages,
                                            Map<Long, Double> exactAmounts) {

        Expense expense = expenseRepository.findById(expenseId).orElseThrow();
        Group group = expense.getGroup();
        List<User> members = group.getMembers();
        Long paidById = expense.getPaidBy().getId();
        List<ExpenseSplit> splits = new ArrayList<>();

        for (User member : members) {
            if (member.getId().equals(paidById)) continue;

            double amountOwed = 0;
            Double percentage = null;

            switch (expense.getSplitType()) {
                case EQUAL:
                    amountOwed = expense.getAmount() / members.size();
                    break;
                case PERCENTAGE:
                    percentage = percentages.get(member.getId());
                    amountOwed = expense.getAmount() * (percentage / 100);
                    break;
                case EXACT:
                    amountOwed = exactAmounts.get(member.getId());
                    break;
            }

            ExpenseSplit split = new ExpenseSplit();
            split.setExpense(expense);
            split.setUser(member);
            split.setAmountOwed(amountOwed);
            split.setPercentage(percentage);
            split.setIsSettled(false);
            splits.add(split);
        }

        return splitRepository.saveAll(splits);
    }

    public Map<Long, Double> calculateBalances(Long groupId) {
        List<ExpenseSplit> unsettled = splitRepository.findUnsettledByGroupId(groupId);
        Map<Long, Double> balances = new HashMap<>();

        for (ExpenseSplit split : unsettled) {
            Long owerId = split.getUser().getId();
            Long owedToId = split.getExpense().getPaidBy().getId();
            double amount = split.getAmountOwed();

            balances.merge(owerId, -amount, Double::sum);
            balances.merge(owedToId, amount, Double::sum);
        }
        return balances;
    }

    public void settleSplit(Long splitId) {
        ExpenseSplit split = splitRepository.findById(splitId).orElseThrow();
        split.setIsSettled(true);
        splitRepository.save(split);
    }
}