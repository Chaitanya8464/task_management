import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service.js";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // =====================================================
  // Guest Login
  // =====================================================

  @Post("guest")
  guestLogin() {
    return this.authService.guestLogin();
  }

  // =====================================================
  // Google Login
  // =====================================================

  @Post("google")
  googleLogin(
    @Body("credential") credential: string,
  ) {
    return this.authService.googleLogin(
      credential,
    );
  }
}