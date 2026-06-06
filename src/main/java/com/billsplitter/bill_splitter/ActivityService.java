package com.billsplitter.bill_splitter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    public void log(Group group, User user, Activity.Type type, String message) {
        Activity activity = new Activity();
        activity.setGroup(group);
        activity.setUser(user);
        activity.setType(type);
        activity.setMessage(message);
        activityRepository.save(activity);
    }
}