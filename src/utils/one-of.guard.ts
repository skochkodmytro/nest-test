import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { isObservable, lastValueFrom } from 'rxjs';

export function OneOfGuards(...guards: Type<CanActivate>[]): Type<CanActivate> {
  @Injectable()
  class OneOfGuard implements CanActivate {
    constructor(private readonly moduleRef: ModuleRef) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      let error: Error | null = null;

      for (const Guard of guards) {
        const guardInstance = this.moduleRef.get(Guard, { strict: false });

        if (!guardInstance) {
          continue;
        }

        try {
          const result = guardInstance.canActivate(context);
          const resolved = await this.resolveResult(result);

          if (resolved) {
            return true;
          }
        } catch (err) {
          error = err;
        }
      }

      if (error) {
        throw error;
      }

      return false;
    }

    private async resolveResult(
      result: boolean | Promise<boolean> | import('rxjs').Observable<boolean>,
    ): Promise<boolean> {
      if (isObservable(result)) {
        return await lastValueFrom(result);
      }

      return result instanceof Promise ? await result : result;
    }
  }

  return mixin(OneOfGuard);
}
