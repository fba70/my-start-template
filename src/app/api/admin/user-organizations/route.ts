import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/get-session"
import { db } from "@/db/drizzle"
import { member, organization } from "@/db/schema"
import { eq } from "drizzle-orm"

export type UserOrgInfo = {
  memberId: string
  organizationId: string
  organizationName: string
  orgRole: string
}

export async function GET() {
  const session = await getServerSession()

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const members = await db
      .select({
        memberId: member.id,
        userId: member.userId,
        orgRole: member.role,
        organizationId: member.organizationId,
        organizationName: organization.name,
      })
      .from(member)
      .innerJoin(organization, eq(member.organizationId, organization.id))

    const userOrgMap: Record<string, string> = {}
    const userOrgDetails: Record<string, UserOrgInfo[]> = {}

    for (const m of members) {
      // Display name map (for the table column)
      if (userOrgMap[m.userId]) {
        userOrgMap[m.userId] += `, ${m.organizationName}`
      } else {
        userOrgMap[m.userId] = m.organizationName
      }

      // Detailed info (for org role editing)
      if (!userOrgDetails[m.userId]) {
        userOrgDetails[m.userId] = []
      }
      userOrgDetails[m.userId].push({
        memberId: m.memberId,
        organizationId: m.organizationId,
        organizationName: m.organizationName,
        orgRole: m.orgRole,
      })
    }

    return NextResponse.json({ userOrgMap, userOrgDetails })
  } catch (error) {
    console.error("Error fetching user organizations:", error)
    return NextResponse.json(
      { error: "Failed to fetch user organizations" },
      { status: 500 },
    )
  }
}
