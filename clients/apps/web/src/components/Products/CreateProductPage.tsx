import {
  useBenefits,
  useCreateProduct,
  useUpdateProductBenefits,
} from '@/hooks/queries'
import { useStore } from '@/store'
import { setValidationErrors } from '@/utils/api/errors'
import {
  type Benefit,
  Organization,
  ProductCreate,
  ProductPriceType,
  ResponseError,
  ValidationError,
} from '@polar-sh/api'
import Button from '@polar-sh/ui/components/atoms/Button'
import { Form } from '@polar-sh/ui/components/ui/form'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CheckoutInfo } from '../Checkout/CheckoutInfo'
import { createCheckoutPreview } from '../Customization/utils'
import { DashboardBody } from '../Layout/DashboardLayout'
import { getStatusRedirect } from '../Toast/utils'
import ProductBenefitsForm from './ProductBenefitsForm'
import ProductForm, { ProductFullMediasMixin } from './ProductForm/ProductForm'
import { productCreateToProduct } from './utils'

export interface CreateProductPageProps {
  organization: Organization
  productPriceType?: ProductPriceType
}

export const CreateProductPage = ({ organization }: CreateProductPageProps) => {
  const router = useRouter()
  const benefits = useBenefits(organization.id, 100)
  const organizationBenefits = useMemo(
    () => benefits.data?.items ?? [],
    [benefits],
  )

  const {
    formDrafts: { ProductCreate: savedFormValues },
    saveDraft,
    clearDraft,
  } = useStore()

  const [enabledBenefitIds, setEnabledBenefitIds] = useState<Benefit['id'][]>(
    [],
  )

  const [isLoading, setLoading] = useState(false)

  const form = useForm<ProductCreate & ProductFullMediasMixin>({
    defaultValues: {
      ...{
        prices: [
          {
            type: ProductPriceType.ONE_TIME,
            price_amount: undefined,
            price_currency: 'usd',
          },
        ],
      },
      ...{
        medias: [],
        full_medias: [],
      },
      ...(savedFormValues ? savedFormValues : {}),
      organization_id: organization.id,
    },
  })
  const { handleSubmit, watch, setError } = form
  const newProduct = watch()

  const createProduct = useCreateProduct(organization)
  const updateBenefits = useUpdateProductBenefits(organization)

  const createdProduct = watch()
  const reconciledProduct = productCreateToProduct(
    organization.id,
    createdProduct,
    enabledBenefitIds
      .map((id) => organizationBenefits.find((b) => b.id === id))
      .filter(Boolean) as Benefit[],
  )

  const onSubmit = useCallback(
    async (productCreate: ProductCreate & ProductFullMediasMixin) => {
      try {
        setLoading(true)
        const { full_medias, ...productCreateRest } = productCreate
        const product = await createProduct.mutateAsync({
          ...productCreateRest,
          medias: full_medias.map((media) => media.id),
        })
        await updateBenefits.mutateAsync({
          id: product.id,
          body: {
            benefits: enabledBenefitIds,
          },
        })

        clearDraft('ProductCreate')

        router.push(
          getStatusRedirect(
            `/dashboard/${organization.slug}/products`,
            'Product Created',
            `Product ${product.name} was created successfully`,
          ),
        )
      } catch (e) {
        setLoading(false)
        if (e instanceof ResponseError) {
          const body = await e.response.json()
          if (e.response.status === 422) {
            const validationErrors = body['detail'] as ValidationError[]
            setValidationErrors(validationErrors, setError)
          }
        }
      }
    },
    [
      organization,
      enabledBenefitIds,
      createProduct,
      updateBenefits,
      setError,
      clearDraft,
      router,
    ],
  )

  const onSelectBenefit = useCallback(
    (benefit: Benefit) => {
      setEnabledBenefitIds((benefitIds) => [...benefitIds, benefit.id])
    },
    [setEnabledBenefitIds],
  )

  const onRemoveBenefit = useCallback(
    (benefit: Benefit) => {
      setEnabledBenefitIds((benefitIds) =>
        benefitIds.filter((b) => b !== benefit.id),
      )
    },
    [setEnabledBenefitIds],
  )

  const enabledBenefits = useMemo(
    () =>
      organizationBenefits.filter((benefit) =>
        enabledBenefitIds.includes(benefit.id),
      ),
    [organizationBenefits, enabledBenefitIds],
  )

  useEffect(() => {
    const pagehideListener = () => {
      saveDraft('ProductCreate', newProduct)
    }
    window.addEventListener('pagehide', pagehideListener)
    return () => window.removeEventListener('pagehide', pagehideListener)
  }, [newProduct, saveDraft])

  return (
    <DashboardBody
      title="Create Product"
      wrapperClassName="!max-w-screen-md"
      className="gap-y-16"
      contextViewClassName="hidden md:block"
      contextView={
        <div className="flex h-full flex-col justify-between p-8 py-12">
          <CheckoutInfo
            className="md:w-full md:p-0"
            checkout={createCheckoutPreview(
              reconciledProduct,
              reconciledProduct.prices[0],
              organization,
            )}
          />
        </div>
      }
    >
      <div className="rounded-4xl dark:border-polar-700 dark:divide-polar-700 flex flex-col gap-y-8 divide-y divide-gray-200 border border-gray-200">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-6"
          >
            <ProductForm organization={organization} update={false} />
          </form>
        </Form>
        <ProductBenefitsForm
          organization={organization}
          organizationBenefits={organizationBenefits.filter(
            (benefit) =>
              // Hide not selectable benefits unless they are already enabled
              benefit.selectable ||
              enabledBenefits.some((b) => b.id === benefit.id),
          )}
          benefits={enabledBenefits}
          onSelectBenefit={onSelectBenefit}
          onRemoveBenefit={onRemoveBenefit}
        />
      </div>
      <div className="flex flex-row items-center gap-2 pb-12">
        <Button onClick={handleSubmit(onSubmit)} loading={isLoading}>
          Create Product
        </Button>
      </div>
    </DashboardBody>
  )
}
