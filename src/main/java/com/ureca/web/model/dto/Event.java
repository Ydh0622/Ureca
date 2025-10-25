package com.ureca.web.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    
    private int no;
    private String title;
    private String period;
    private String img;
    private String category;
    private String status;
    
}