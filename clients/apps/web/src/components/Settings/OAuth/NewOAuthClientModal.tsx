import { InlineModalHeader } from '@/components/Modal/InlineModal'
import { toast } from '@/components/Toast/use-toast'
import { useCreateOAuth2Client } from '@/hooks/queries/oauth'
import {
  OAuth2Client,
  OAuth2ClientConfiguration,
  ResponseError,
} from '@polar-sh/api'
import Button from '@polar-sh/ui/components/atoms/Button'
import { Form } from '@polar-sh/ui/components/ui/form'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  FieldClientType,
  FieldClientURI,
  FieldLogo,
  FieldName,
  FieldPrivacy,
  FieldRedirectURIs,
  FieldScopes,
  FieldTOS,
} from './OAuthForm'

export interface EnhancedOAuth2ClientConfiguration
  extends Omit<OAuth2ClientConfiguration, 'redirect_uris' | 'scope'> {
  redirect_uris: { uri: string }[]
  scope: string[]
}

interface NewOAuthClientModalProps {
  onSuccess: (client: OAuth2Client) => void
  onHide: () => void
}

export const NewOAuthClientModal = ({
  onSuccess,
  onHide,
}: NewOAuthClientModalProps) => {
  const form = useForm<EnhancedOAuth2ClientConfiguration>({
    defaultValues: {
      token_endpoint_auth_method: 'client_secret_post',
      redirect_uris: [{ uri: '' }],
      scope: [],
    },
  })

  const { handleSubmit } = form

  const [created, setCreated] = useState<OAuth2Client>()
  const [isCreating, setIsCreating] = useState(false)

  const createOAuth2Client = useCreateOAuth2Client()

  const onSubmit = useCallback(
    async (form: EnhancedOAuth2ClientConfiguration) => {
      setIsCreating(true)

      try {
        const res = await createOAuth2Client.mutateAsync({
          ...form,
          redirect_uris: form.redirect_uris.map(({ uri }) => uri),
          scope: form.scope.join(' '),
        })

        toast({
          title: 'OAuth App Created',
          description: `OAuth App ${res.client_name} was created successfully`,
        })

        setCreated(res)
        onSuccess(res)
      } catch (e) {
        if (e instanceof ResponseError) {
          toast({
            title: 'OAuth App Creation Failed',
            description: `Error creating OAuth App: ${e.message}`,
          })
        }
      } finally {
        setIsCreating(false)
      }
    },
    [createOAuth2Client, setCreated, setIsCreating, onSuccess],
  )

  return (
    <div className="flex flex-col overflow-y-auto">
      <InlineModalHeader hide={onHide}>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl">New OAuth App</h2>
        </div>
      </InlineModalHeader>
      <div className="flex flex-col gap-y-8 p-8">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-[700px] space-y-8"
          >
            <FieldName />
            <FieldLogo />
            <FieldClientType />
            <FieldRedirectURIs />
            <FieldScopes />
            <FieldClientURI />
            <FieldTOS />
            <FieldPrivacy />

            <Button
              type="submit"
              loading={isCreating}
              disabled={Boolean(created)}
            >
              Create
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
