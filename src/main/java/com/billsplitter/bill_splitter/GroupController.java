package com.billsplitter.bill_splitter;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.Data;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityService activityService;

    @PostMapping("/create")
    public ResponseEntity<?> createGroup(@RequestBody GroupRequest request) {
        User creator = userRepository.findById(request.getCreatedById()).orElse(null);
        if (creator == null)
            return ResponseEntity.badRequest().body("User not found!");

        List<User> members = userRepository.findAllById(request.getMemberIds());
        if (!members.contains(creator))
            members.add(creator);

        Group group = new Group();
        group.setName(request.getName());
        group.setCreatedBy(creator);
        group.setMembers(members);
        groupRepository.save(group);

        // Log activity
        activityService.log(group, creator, Activity.Type.GROUP_CREATED,
                creator.getName() + " created the group \"" + group.getName() + "\" 🎉");

        return ResponseEntity.ok(group);
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
        groupRepository.save(group);

        // Log activity
        activityService.log(group, user, Activity.Type.MEMBER_JOINED,
                user.getName() + " joined the group 👋");

        return ResponseEntity.ok(group);
    }

    @PutMapping("/{id}/budget")
    public ResponseEntity<?> setBudget(@PathVariable Long id,
            @RequestBody BudgetRequest request) {
        Group group = groupRepository.findById(id).orElse(null);
        if (group == null)
            return ResponseEntity.badRequest().body("Group not found!");

        group.setBudgetLimit(request.getBudgetLimit());
        groupRepository.save(group);

        // Log activity
        activityService.log(group, group.getCreatedBy(), Activity.Type.EXPENSE_ADDED,
                "Budget set to ₹" + request.getBudgetLimit() + " 💰");

        return ResponseEntity.ok(group);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGroupById(@PathVariable Long id) {
        Group group = groupRepository.findById(id).orElse(null);
        if (group == null)
            return ResponseEntity.badRequest().body("Group not found!");
        return ResponseEntity.ok(group);
    }

    @Data
    static class AddMemberRequest {
        private Long userId;
    }

    @Data
    static class BudgetRequest {
        private Double budgetLimit;
    }
}