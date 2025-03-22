# CreativeSeoul

## 1. 개요
CreativeSeoul은 디자인, 마케팅, 비주얼 등 크리에이티브 분야에 특화된 구인구직 플랫폼으로, 한국과 해외의 디자인 감각 차이에 주목해 만들게 되었습니다. 한국 기업이 글로벌 시장에 진출하거나, 해외 기업이 한국의 인재를 찾고자 할 때, 각 시장의 문화적 맥락을 이해하는 인재가 도움이 될 수 있다고 생각하였으며, CreativeSeoul은 이런 다채로운 시각을 가진 인재들을 위한 구인구직 플랫폼입니다.

## 2. 배포 및 API 명세
- **[CreativeSeoul](https://creativeseoul.com)**
- **[API Swagger 명세](https://api.creativeseoul.com/api)**

## 3. 기술 스택

### 언어 및 런타임
- **TypeScript**
- **Node.js 22**

### 프레임워크 및 라이브러리
- **Nestjs**
- **BullMQ**
- **Pino**

### 데이터베이스
- **PostgreSQL**
- **Redis**

### 인프라 및 배포
- **Docker**
- **AWS EC2**
- **AWS ECR**
- **AWS RDS PostgreSQL**
- **Cloudflare R2**
- **Redis Cloud**
- **GitHub Actions**

### 외부 서비스
- **Stripe**
- **AWS SES**

## ERD & System Architecture

### ERD
![erd](https://github.com/user-attachments/assets/9585dc5c-6111-41c3-bb13-f372fbe18b1b)

### 시스템 아키텍처
![image](https://github.com/user-attachments/assets/5c6ed1ee-78ec-43ea-8bf4-705c1c7d6c93)

## 4. 주요 기능

### 인증 및 사용자 관리
- **계정 생성/접근**: 회원가입, 로그인, 로그아웃, 이메일 인증
- **보안 관리**: 비밀번호 찾기/재설정, 세션 정보 관리
- **계정 관리**: 계정 삭제

### 인재(Talent) 관리
- **프로필**: 인재 프로필 생성 및 관리, 아바타 이미지 업로드
- **점수 시스템**: 업데이트 시 랭킹을 위한 프로필 점수화
- **검색 및 조회**: 랭킹 시스템을 통한 인재 목록 조회, 특정 인재 조회
- **활동 추적**: 유저 활동 추적
- **선호도 설정**: 원하는 일자리 유형 설정

### 멤버 관리
- **조회 기능**: 멤버 목록 조회, 특정 멤버 정보 조회

### 기업(Company) 관리
- **프로필**: 기업 프로필 생성 및 관리, 기업 로고 이미지 업로드
- **멤버십**: 기업 유저를 플랫폼으로 초대 및 초대 수락
- **스폰서십**: 스폰서 기업 조회

### 채용공고 관리
- **공고 등록**: 일반(Regular) 및 주요(Featured) 채용공고 등록
- **검색 및 조회**: 채용공고 필터링, 검색 및 조회
- **공고 관리**: 개인 채용공고 관리, 채용공고 게시/비게시 및 갱신
- **성과 측정**: 지원 클릭 통계 추적
- **자동화**: 만료된 채용공고 자동 비게시

### 결제 및 청구
- **결제 시스템**: 크레딧 결제 시스템, 스폰서십 결제
- **웹훅 처리**: 결제 관련 이벤트 처리
- **정보 관리**: 기업 결제 정보 및 크레딧 잔액 관리

### 이벤트 관리
- **이벤트 기능**: 이벤트 등록 및 조회
- **미디어**: 이벤트 커버 이미지 업로드

## 5. 문제 해결 및 기술적 고민

### Result 패턴을 이용한 에러 처리

**배경**  
예외(Exception)를 흐름 제어(flow control)에 사용하는 것은 적절치 않다는 판단을 하게됨.

**문제점**  
기존 예외 처리 방식은 예상된 오류도 예외로 처리해야 하며, 스택 트레이스 생성으로 성능 저하 발생. 코드 흐름 파악도 어려움.

**해결 방법**
- Result 패턴 도입: 함수의 실행 결과를 성공과 실패로 명확하게 구분하는 방식
- 타입스크립트 제네릭을 활용한 Result 클래스 구현 (성공/실패 타입 지정)
- 서비스 레이어에서 예외 대신 Result 객체 반환으로 예상된 실패 상황 명확히 표현
- 도메인별 에러 케이스 중앙화로 일관성 유지 및 재사용성 향상

📝 [전체 글 읽기](https://medium.com/@oink2716/nestjs에서-result-패턴을-적용하여-에러-처리하기-d59d9294f6a2)

### 구직자 프로필 랭킹 시스템

**배경**  
구인구직 플랫폼 개발 중 "어떤 구직자 프로필을 사용자에게 먼저 보여줄 것인가?" 문제 해결 필요.

**문제점**  
단일 정렬 기준만으로는 이상적인 사용자 경험 제공 어려움. 최근 업데이트, 최근 활동, 프로필 완성도 각각 한계 존재.

**해결 방법**
- 사용자 활동 추적을 위한 TalentActivityService 구현 (캐싱 통한 DB 부하 감소)
- NestJS Interceptor를 활용한 응답 완료 후 사용자 활동 기록
- 프로필 업데이트 '쿨다운' 개념 도입으로 랭킹 조작 방지 (14일)
- 프로필 요소별 점수화 시스템 구현 (프로필 사진, 자기소개, 언어 능력, 거주 도시)
- 우선순위 티어(Priority Tier) 개념을 통한 복합 랭킹 시스템 설계
- MikroORM의 raw SQL 표현식 활용한 효율적 쿼리 구현

📝 [전체 글 읽기](https://medium.com/@oink2716/구인구직-플랫폼-구직자-프로필-랭킹-시스템-구현하기-eb5270111a02)

### MikroORM 부분 로드 엔티티 타입 안전성 유지

**배경**  
부분 필드 선택을 통한 DB 성능 최적화와 타입 안전성 사이의 균형 확보 필요.

**문제점**  
MikroORM의 `fields` 옵션을 사용한 부분 로딩 시 TypeScript 타입 호환성 문제 발생.

**해결 방법**
- 상수 필드 배열과 TypeScript의 타입 추출 패턴을 활용한 해결책 구현
- `as const` 키워드로 정의된 필드 리스트로부터 타입 자동 추출
- 관계 엔티티 필드 처리를 위한 조건부 타입과 `infer` 키워드 활용
- 단일 진실 공급원(Single Source of Truth) 원칙에 따라 필드 목록 중앙화 관리

📝 [전체 글 읽기](https://medium.com/@oink2716/mikroorm에서-부분-엔티티-로딩-시-타입-안전성-유지하기-ab4225ea3e1f)


## 6. 화면 스크린샷

<details>
<summary><b>홈 화면</b></summary>

<img src="https://github.com/user-attachments/assets/8743ab19-6b30-48ab-9a7d-a4d9e163a68b" width="200px" style="object-fit: contain; border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
</details>

<details>
<summary><b>채용 공고</b></summary>

<img src="https://github.com/user-attachments/assets/dbcaa00b-6724-4f38-8825-65a48067db31" width="200px" style="object-fit: contain; border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
<img src="https://github.com/user-attachments/assets/dcdf95e6-cc35-4968-8db1-a767c946471d" width="200px" style="object-fit: contain; border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
</details>

<details>
<summary><b>기업 정보</b></summary>

<img src="https://github.com/user-attachments/assets/9772c67b-1d28-4c67-9fc9-affb4c662727" width="200px" style="object-fit: contain; border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
<img src="https://github.com/user-attachments/assets/de6f0d6a-8163-44fa-bade-cd1c78398829" width="200px" style="object-fit: contain; border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
<img src="https://github.com/user-attachments/assets/60f41bb4-8f50-4b08-a605-255d8166af2b" width="200px" style="object-fit: contain; border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
</details>

<details>
<summary><b>인재 정보</b></summary>

<img src="https://github.com/user-attachments/assets/535fd4b9-fe8d-45f4-b876-680c6628a40e" width="200px" style="object-fit: contain; border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
<img src="https://github.com/user-attachments/assets/1a516cc4-feae-492a-a2d8-8957d77d2404" width="200px" style="object-fit: contain; border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
</details>

<details>
<summary><b>로그인</b></summary>

<img src="https://github.com/user-attachments/assets/398b1001-a585-463f-b991-758bc3ca1167" width="200px" style="object-fit: contain; border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
</details>

<details>
<summary><b>인재 프로필 관리</b></summary>

<img src="https://github.com/user-attachments/assets/adac22ef-1dc0-4517-a5df-650ac37013ec" width="200px" style="object-fit: contain; border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
<img src="https://github.com/user-attachments/assets/44fb4346-097d-4b8c-ad67-e0e148ef32bf" width="200px" style="object-fit: contain; border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
<img src="https://github.com/user-attachments/assets/eec0eb1e-aa47-4a1d-bb4c-7f6f034fe09a" width="200px" style="object-fit: contain; border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
</details>

<details>
<summary><b>기업 프로필 및 결제 관리</b></summary>

<img src="https://github.com/user-attachments/assets/d376d845-3f2c-4c3d-913f-4fa0d2ae6655" width="200px" style="object-fit: contain; border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
<img src="https://github.com/user-attachments/assets/333112bf-dc82-428a-a46e-a6020453e217" width="200px" style="object-fit: contain; border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
<img src="https://github.com/user-attachments/assets/77902671-89e8-430e-8fbc-be087832b052" width="200px" style="object-fit: contain; border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
<img src="https://github.com/user-attachments/assets/1943254c-7d56-4289-9a24-b4b9504df94c" width="200px" style="object-fit: contain; border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
</details>

<details>
<summary><b>어드민 패널</b></summary>

<img src="https://github.com/user-attachments/assets/e3dbae55-dc95-426b-a0b5-fe0ba91684e1" width="200px" style="object-fit: contain; border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
<img src="https://github.com/user-attachments/assets/43b7c80a-5fa2-4d38-ae70-cd4e74440ff9" width="200px" style="object-fit: contain; border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
<img src="https://github.com/user-attachments/assets/70c9ac9d-38ef-498f-9973-453c17407365" width="200px" style="object-fit: contain; border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
</details>