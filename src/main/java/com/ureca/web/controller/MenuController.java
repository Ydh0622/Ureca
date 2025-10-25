package com.ureca.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ureca.web.model.StarException;
import com.ureca.web.model.dto.Member;
import com.ureca.web.model.dto.Menu;
import com.ureca.web.model.dto.MenuDetailDto;
import com.ureca.web.model.service.MenuService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class MenuController {

	@Autowired
	MenuService menuService;

	@GetMapping("/getMenus")
	public List<Menu> getMenus(HttpServletRequest request) {
		try {

			return menuService.getMenus();

		} catch (StarException e) {
			return null;
		}
	}
	
	@GetMapping("/menu/{no}")
	public ResponseEntity<MenuDetailDto> getPhoneDetail(@PathVariable int no) {
		System.out.println(no);
		
		MenuDetailDto phoneDetail=menuService.getMenuDetail(no);
		if(phoneDetail!=null) {
			return new ResponseEntity<>(phoneDetail, HttpStatus.OK);
		}else {
			return new ResponseEntity<>( HttpStatus.NOT_FOUND);
		}
	}
	

}
