package com.ureca.web.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ureca.web.model.StarException;
import com.ureca.web.model.dto.Member;
import com.ureca.web.model.service.MemberService;

@RestController
public class MemberController {
	
	@Autowired
	MemberService memberService;
	
	@PostMapping("/signup")
	public Map<String, Object> signup(@RequestBody Member m){
		Map<String, Object> response=new HashMap();
		
		try {
			memberService.registerMember(m);
			response.put("msg", "success");
			
		}catch(StarException e) {
			response.put("msg", e.getMessage());
			//e.printStackTrace();
		}
		
		return response;
	}

}
