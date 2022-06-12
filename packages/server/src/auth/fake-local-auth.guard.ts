import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * This auth guard is used only by our Fake Auth flow. It applies the
 * FakeLocalStrategy class. This guard is used only on the 'login' route.
 * If someone tries logging and the FakeLocalStrategy's validation succeeds,
 * then they receive a signed JWT. After that, the JWT will be used for
 * future authentication in all API calls that require auth.
 *
 * This is only used in development when the SCOUT_SERVER_USE_FAKE_AUTH
 * environment variable is set.
 */
export class FakeLocalAuthGuard extends AuthGuard('fake-local') {}
