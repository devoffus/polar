from typing import Sequence

from fastapi import APIRouter, Depends
from polar.actions import organization
from polar.api.deps import current_active_user, get_db_session
from polar.models import Organization, User
from polar.postgres import AsyncSession
from polar.schema.organization import OrganizationSchema
from polar.schema.repository import RepositorySchema

router = APIRouter(prefix="/user/organizations", tags=["user.organizations"])


@router.get("", response_model=list[OrganizationSchema])
async def get_user_organizations(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_db_session),
) -> Sequence[OrganizationSchema]:
    orgs = await organization.get_all_org_repos_by_user_id(session, user.id)

    # Fast API doesn't support nested schemas yet, so we have to do this manually
    # See https://github.com/tiangolo/fastapi/issues/1645
    def expand_children(org: Organization) -> OrganizationSchema:
        o = OrganizationSchema.from_orm(org)
        o.repositories = [
            RepositorySchema.from_orm(repo)
            for repo in org.repos
            if repo.organization_id == org.id
        ]
        return o

    return [expand_children(org) for org in orgs]
