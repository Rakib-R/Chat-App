// app/(root)/organization.ts
"use server";
import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';


// ONLY UI ACTIVE ORGANIZATION
export const getCurrentOrg = async () => {
  const client = await clerkClient();
  const user = await currentUser();
  if (!user) return null;
  
  const { orgId, orgRole } = await auth();
  if (!orgId || !orgRole) return null;
  
  const org = await client.organizations.getOrganization({ 
    organizationId: orgId 
  });
  
  return {
    orgId,
    role: orgRole === "org:admin" ? 'Admin' : orgRole === "org:member" ? 'Member' : 'Guest',
    orgName: org.name,
    orgImg: org.imageUrl,
  };
};

// ALL CLERK Organization MEMBERS
export async function clerkMember(organizationId: string) {
  const client = await clerkClient();
  const { data, totalCount } = await client.organizations.getOrganizationMembershipList({
    organizationId: organizationId,
    query: 'john',
    orderBy: '-created_at',
  });
  
  return { dataMember: data, totalMember: totalCount };
}

// ALL CREATED CLERK Organization
export async function clerkOrg() {
  const client = await clerkClient();
  const { data, totalCount } = await client.organizations.getOrganizationList();
  return { orgs: data, totalOrgs: totalCount };
}

// Get current 'USER's ALL Organizations (server-side)
export async function getUserOrganizations() {
  
  interface orgsType {
    id : string;
    name: string;
    role: string;
    joinedAt:number;
    img : string;
  }
  const client = await clerkClient();
  const { userId } = await auth();

  if (!userId) return { orgsData: [] };
  
  const { data } = await client.users.getOrganizationMembershipList({
    userId: userId,
  });
  
  const orgsData = data.reduce((acc, membership) => {
    acc.push({
      id: membership.organization.id,
      name: membership.organization.name,
      role: membership.role,
      joinedAt: membership.createdAt,
      img: membership.organization.imageUrl,
    });
    return acc;
  }, [] as orgsType[]); // Empty array as initial value
  
  return { orgsData };
}