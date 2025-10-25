package com.ureca.web.model.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Member {
    private int no;
    private String id;
    private String pw;
    private String email;
}