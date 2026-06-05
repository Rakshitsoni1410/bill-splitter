package com.billsplitter.bill_splitter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.Data;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createGroup(@RequestBody GroupRequest request) {
        User creator = userRepository.findById(request.getCreatedById())
                .orElse(null);
        if (creator == null)
            return ResponseEntity.badRequest().body("User not found!");

        List<User> members = userRepository.findAllById(request.getMemberIds());
        if (!members.contains(creator))
            members.add(creator);

        Group group = new Group();
        group.setName(request.getName());
        group.setCreatedBy(creator);
        group.setMembers(members);

        return ResponseEntity.ok(groupRepository.save(group));
    }

    @GetMapping("/user/{userId}")
    public List<Group> getMyGroups(@PathVariable Long userId) {
        return groupRepository.findByCreatedById(userId);
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<?> addMember(@PathVariable Long id,
            @RequestBody AddMemberRequest request) {
        Group group = groupRepository.findById(id).orElse(null);
        if (group == null)
            return ResponseEntity.badRequest().body("Group not found!");

        User user = userRepository.findById(request.getUserId()).orElse(null);
        if (user == null)
            return ResponseEntity.badRequest().body("User not found!");

        if (!group.getMembers().contains(user)) {
            group.getMembers().add(user);
        }
        return ResponseEntity.ok(groupRepository.save(group));
    }

    @Data
    static class AddMemberRequest {
        private Long userId;
    }

    @PutMapping("/{id}/budget")
    public ResponseEntity<?> setBudget(@PathVariable Long id,
            @RequestBody BudgetRequest request) {
        Group group = groupRepository.findById(id).orElse(null);
        if (group == null)
            return ResponseEntity.badRequest().body("Group not found!");

        group.setBudgetLimit(request.getBudgetLimit());
        return ResponseEntity.ok(groupRepository.save(group));
    }

    @Data
    static class BudgetRequest {
        private Double budgetLimit;
    }
}