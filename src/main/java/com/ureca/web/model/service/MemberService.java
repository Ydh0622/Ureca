package com.ureca.web.model.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ureca.web.model.StarException;
import com.ureca.web.model.dao.MemberDao;
import com.ureca.web.model.dao.SaltDao;
import com.ureca.web.model.dto.Member;
import com.ureca.web.model.dto.SaltInfo;
import com.ureca.web.util.OpenCrypt;

/**
 * 회원 관련 비즈니스 로직을 처리하는 서비스 클래스
 */
@Service
public class MemberService {

	@Autowired
	MemberDao memberDao;
	
	@Autowired
	SaltDao saltDao;
	
	//회원가입
	@Transactional(rollbackFor = Exception.class)
	public void registerMember(Member member) throws StarException {
		try {
			//유효성 검사
			
			//salt생성
			String salt=UUID.randomUUID().toString();
			SaltInfo saltInfo=new SaltInfo(member.getId(), salt);
			saltDao.insertSalt(saltInfo);
			
			//pw암호화
			String pwdHash=OpenCrypt.byteArrayToHex(OpenCrypt.getSHA256(member.getPw(), salt));
			member.setPw(pwdHash);
			
			memberDao.registerMember(member);
		}catch(DuplicateKeyException  e) {
			throw new StarException("id나 email이 이미 사용중입니다");
		}catch(Exception e) {
			e.printStackTrace();
			throw new StarException("잠시 후 다시 시도해 주세요");
		}
	}


	//id 로그인
	public Member staridLogin(Member m) throws StarException {	
		try {
			SaltInfo saltInfo=saltDao.selectSalt(m.getId());
			byte[] pwdHash=OpenCrypt.getSHA256(m.getPw(), saltInfo.getSalt());
			String pwdHashHex=OpenCrypt.byteArrayToHex(pwdHash);
			m.setPw(pwdHashHex);
			
			return memberDao.staridLogin(m);
		}catch(Exception e) {
			throw new StarException("잠시 후 다시 시도해 주세요");
		}
	}

}