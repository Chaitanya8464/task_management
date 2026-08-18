import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { OAuth2Client } from "google-auth-library";

import { PrismaService } from "../prisma.service.js";

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly prisma: PrismaService,
  ) {
    this.googleClient =
      new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
      );
  }

  // =====================================================
  // Guest Login
  // =====================================================

  async guestLogin() {
    const guestEmail =
      "guest@taskflow.local";

    const result =
      await this.prisma.$transaction(
        async (tx) => {
          // 1. Find or create guest user

          const user =
            await tx.user.upsert({
              where: {
                email: guestEmail,
              },

              update: {},

              create: {
                name: "Guest User",
                email: guestEmail,
              },
            });

          // 2. Find or create guest workspace

          let workspace =
            await tx.workspace.findFirst({
              where: {
                ownerId: user.id,
                name: "TaskFlow Workspace",
              },
            });

          if (!workspace) {
            workspace =
              await tx.workspace.create({
                data: {
                  name: "TaskFlow Workspace",
                  ownerId: user.id,
                },
              });
          }

          // 3. Make sure guest is workspace member

          await tx.workspaceMember.upsert({
            where: {
              workspaceId_userId: {
                workspaceId:
                  workspace.id,
                userId: user.id,
              },
            },

            update: {
              role: "OWNER",
            },

            create: {
              workspaceId:
                workspace.id,
              userId: user.id,
              role: "OWNER",
            },
          });

          return {
            user,
            workspace,
          };
        },
      );

    return {
      message:
        "Guest login successful",

      user: result.user,

      workspace:
        result.workspace,
    };
  }

  // =====================================================
  // Google Login
  // =====================================================

  async googleLogin(
    credential: string,
  ) {
    // ---------------------------------------------------
    // Validate credential
    // ---------------------------------------------------

    if (!credential) {
      throw new UnauthorizedException(
        "Google credential is required.",
      );
    }

    if (
      !process.env.GOOGLE_CLIENT_ID
    ) {
      throw new Error(
        "GOOGLE_CLIENT_ID is not configured.",
      );
    }

    // ---------------------------------------------------
    // Verify Google ID token
    // ---------------------------------------------------

    let payload;

    try {
      const ticket =
        await this.googleClient.verifyIdToken(
          {
            idToken: credential,

            audience:
              process.env
                .GOOGLE_CLIENT_ID,
          },
        );

      payload =
        ticket.getPayload();
    } catch (error) {
      console.error(
        "Google token verification failed:",
        error,
      );

      throw new UnauthorizedException(
        "Invalid Google credential.",
      );
    }

    // ---------------------------------------------------
    // Extract verified Google information
    // ---------------------------------------------------

    const email =
      payload?.email;

    const emailVerified =
      payload?.email_verified;

    const name =
      payload?.name ||
      payload?.email ||
      "Google User";

    const avatar =
      payload?.picture || null;

    // ---------------------------------------------------
    // Validate Google account
    // ---------------------------------------------------

    if (
      !email ||
      !emailVerified
    ) {
      throw new UnauthorizedException(
        "Google email could not be verified.",
      );
    }

    // ---------------------------------------------------
    // Find/Create User + Workspace
    // ---------------------------------------------------

    const result =
      await this.prisma.$transaction(
        async (tx) => {
          // ---------------------------------------------
          // 1. Find user by Google email
          // ---------------------------------------------

          let user =
            await tx.user.findUnique({
              where: {
                email,
              },
            });

          // ---------------------------------------------
          // 2. Create user if new
          // ---------------------------------------------

          if (!user) {
            user =
              await tx.user.create({
                data: {
                  name,
                  email,
                  avatar,
                },
              });
          } else {
            // -------------------------------------------
            // Update profile information
            // -------------------------------------------

            user =
              await tx.user.update({
                where: {
                  id: user.id,
                },

                data: {
                  name,

                  ...(avatar
                    ? {
                        avatar,
                      }
                    : {}),
                },
              });
          }

          // ---------------------------------------------
          // 3. Find user's workspace
          // ---------------------------------------------

          let workspace =
            await tx.workspace.findFirst({
              where: {
                ownerId: user.id,
              },

              orderBy: {
                createdAt: "asc",
              },
            });

          // ---------------------------------------------
          // 4. Create workspace for new user
          // ---------------------------------------------

          if (!workspace) {
            workspace =
              await tx.workspace.create({
                data: {
                  name: `${name}'s Workspace`,
                  ownerId: user.id,
                },
              });
          }

          // ---------------------------------------------
          // 5. Make user workspace member
          // ---------------------------------------------

          await tx.workspaceMember.upsert({
            where: {
              workspaceId_userId: {
                workspaceId:
                  workspace.id,

                userId:
                  user.id,
              },
            },

            update: {},

            create: {
              workspaceId:
                workspace.id,

              userId:
                user.id,

              role: "OWNER",
            },
          });

          return {
            user,
            workspace,
          };
        },
      );

    // ---------------------------------------------------
    // Return same structure as Guest Login
    // ---------------------------------------------------

    return {
      message:
        "Google login successful",

      user: result.user,

      workspace:
        result.workspace,
    };
  }
}