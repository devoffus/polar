import { api } from '@/utils/api'
import {
  AppPermissionsType,
  OrganizationBillingPlan,
  ResponseError,
} from '@polar-sh/api'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { defaultRetry } from './retry'

export const useCheckOrganizationPermissions: (
  permissions: AppPermissionsType,
  id?: string,
) => UseQueryResult<boolean | undefined> = (permissions, id) =>
  useQuery({
    queryKey: ['organization_billing_plan', permissions, id],
    queryFn: async () => {
      try {
        await api.integrationsGitHub.checkOrganizationPermissions({
          id: id || '',
          body: { permissions },
        })
        return true
      } catch (err) {
        if (err instanceof ResponseError && err.response.status === 403) {
          return false
        }
        throw err
      }
    },
    enabled: !!id,
  })

export const useGetOrganizationBillingPlan: (
  id?: string,
) => UseQueryResult<OrganizationBillingPlan | undefined> = (id) =>
  useQuery({
    queryKey: ['organization_billing_plan', id],
    queryFn: () =>
      api.integrationsGitHub.getOrganizationBillingPlan({
        id: id || '',
      }),
    retry: (failureCount: number, error: ResponseError) =>
      error.response.status !== 403 && defaultRetry(failureCount, error),
    enabled: !!id,
  })
