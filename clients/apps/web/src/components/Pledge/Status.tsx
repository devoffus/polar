'use client'

import IssueListItem from '@/components/Issues/IssueListItem'
import ThankYouUpsell from '@/components/Pledge/ThankYouUpsell'
import { useAuth } from '@/hooks'
import { useSendMagicLink } from '@/hooks/magicLink'
import { organizationPageLink } from '@/utils/nav'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { Organization, Pledge } from '@polar-sh/api'
import Button from '@polar-sh/ui/components/atoms/Button'
import PolarTimeAgo from '@polar-sh/ui/components/atoms/PolarTimeAgo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import GrayCard from '../Cards/GrayCard'

export const Status = (props: {
  pledge: Pledge
  organization: Organization
  email: string | undefined
}) => {
  const pledge = props.pledge
  const { currentUser } = useAuth()
  const router = useRouter()

  const email = props.email
  const [emailSigninLoading, setEmailSigninLoading] = useState(false)
  const sendMagicLink = useSendMagicLink()
  const onEmailSignin = useCallback(async () => {
    if (!email) {
      router.push('/login')
      return
    }

    setEmailSigninLoading(true)
    try {
      sendMagicLink(email)
    } catch (err) {
      // TODO: error handling
    } finally {
      setEmailSigninLoading(false)
    }
  }, [email, router, sendMagicLink])

  // TODO: Handle different statuses than success... #happy-path-alpha-programming
  return (
    <>
      <div className="mx-auto p-4 md:mt-24 md:w-[768px] md:p-0">
        <div className="flex flex-row items-center">
          <h1 className="dark:text-polar-300 w-1/2 text-2xl font-normal text-gray-800">
            <CheckCircleIcon className="inline-block h-10 w-10 text-blue-500" />{' '}
            Thank you!
          </h1>
          <p className="w-1/2 text-right align-middle text-sm font-normal text-gray-600">
            Backed <PolarTimeAgo date={new Date(pledge.created_at)} />
          </p>
        </div>

        {currentUser ? (
          <div className="my-8 flex w-full justify-center">
            <Link href={organizationPageLink(props.organization)}>
              <Button>Continue to {props.organization.name}</Button>
            </Link>
          </div>
        ) : null}

        <GrayCard className="mt-6">
          <IssueListItem
            issue={pledge.issue}
            pledges={[pledge]}
            checkJustPledged={false}
            canAddRemovePolarLabel={false}
            showPledgeAction={true}
            pledgesSummary={null}
            rewards={null}
          />
        </GrayCard>

        {!currentUser ? (
          <ThankYouUpsell
            onEmailSignin={onEmailSignin}
            emailSigninLoading={emailSigninLoading}
          />
        ) : null}
      </div>
    </>
  )
}

export default Status
