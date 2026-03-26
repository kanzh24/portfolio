export type Locale = "en" | "vi";

export const NAV_LABELS: Record<
  Locale,
  Record<"intro" | "skills" | "projects" | "experience" | "contact" | "downloadCv", string>
> = {
  en: {
    intro: "Intro",
    skills: "Skills",
    projects: "Projects",
    experience: "Experience",
    contact: "Contact",
    downloadCv: "Download CV",
  },
  vi: {
    intro: "Giới thiệu",
    skills: "Kỹ năng",
    projects: "Dự án",
    experience: "Kinh nghiệm",
    contact: "Liên hệ",
    downloadCv: "Tải CV",
  },
};

export type UiStrings = {
  projectsActivePrefix: string;
  myRole: string;
  linkFrontend: string;
  linkBackend: string;
  credentials: string;
  establishConnection: string;
  footerTagline: string;
  formName: string;
  formEmail: string;
  formMessage: string;
  formSubmit: string;
  formSending: string;
  formSuccess: string;
  formError: string;
  formErrorConfig: string;
  formErrorTooFast: string;
  formErrorTooOld: string;
  formErrorTurnstile: string;
  formErrorTurnstileConfig: string;
  formErrorValidation: string;
  formErrorServer: string;
  emailJsTitle: string;
  projectsCarouselPrev: string;
  projectsCarouselNext: string;
};

export const UI_STRINGS: Record<Locale, UiStrings> = {
  en: {
    projectsActivePrefix: "Active Projects:",
    myRole: "My Role",
    linkFrontend: "frontend",
    linkBackend: "backend",
    credentials: "Credentials",
    establishConnection: "Establish Connection",
    footerTagline:
      "© 2025 KhanhNg.Portfolio | Intern Fresher Java | Ho Chi Minh City, Viet Nam",
    formName: "Name",
    formEmail: "Email",
    formMessage: "Message",
    formSubmit: "Transmit Message",
    formSending: "Sending...",
    formSuccess: "Message sent successfully! I will reply soon.",
    formError: "Failed to send. Please try again.",
    formErrorConfig: "EmailJS is not configured. Please add environment variables.",
    formErrorTooFast: "Please wait a few seconds before sending — this helps block bots.",
    formErrorTooOld:
      "This form session expired. Refresh the page and try again.",
    formErrorTurnstile: "Complete the security check (CAPTCHA) before sending.",
    formErrorTurnstileConfig:
      "Turnstile is not configured on the server. Add TURNSTILE_SECRET_KEY.",
    formErrorValidation: "Check your name, email, and message (minimum length, valid email).",
    formErrorServer: "Could not send right now. Please try again later.",
    emailJsTitle: "Portfolio email",
    projectsCarouselPrev: "Previous projects",
    projectsCarouselNext: "Next projects",
  },
  vi: {
    projectsActivePrefix: "Dự án đang hoạt động:",
    myRole: "Vai trò của tôi",
    linkFrontend: "frontend",
    linkBackend: "backend",
    credentials: "Bằng cấp & chứng chỉ",
    establishConnection: "Kết nối",
    footerTagline:
      "© 2025 KhanhNg.Portfolio | Intern Fresher Java | TP. Hồ Chí Minh, Việt Nam",
    formName: "Họ tên",
    formEmail: "Email",
    formMessage: "Nội dung",
    formSubmit: "Gửi tin nhắn",
    formSending: "Đang gửi...",
    formSuccess: "Gửi thành công! Tôi sẽ phản hồi sớm.",
    formError: "Gửi thất bại. Vui lòng thử lại.",
    formErrorConfig: "EmailJS chưa được cấu hình. Vui lòng thêm biến môi trường.",
    formErrorTooFast: "Vui lòng đợi vài giây trước khi gửi — giúp chặn bot.",
    formErrorTooOld: "Phiên form đã hết hạn. Tải lại trang và thử lại.",
    formErrorTurnstile: "Hoàn tất bước xác minh bảo mật (CAPTCHA) trước khi gửi.",
    formErrorTurnstileConfig:
      "Chưa cấu hình Turnstile phía server. Thêm TURNSTILE_SECRET_KEY.",
    formErrorValidation:
      "Kiểm tra họ tên, email và nội dung (độ dài tối thiểu, email hợp lệ).",
    formErrorServer: "Không gửi được lúc này. Vui lòng thử lại sau.",
    emailJsTitle: "Email portfolio",
    projectsCarouselPrev: "Dự án trước",
    projectsCarouselNext: "Dự án sau",
  },
};

export function getUi(locale: Locale): UiStrings {
  return UI_STRINGS[locale];
}
