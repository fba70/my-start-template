import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/get-session"
import { db } from "@/db/drizzle"
import { organization, member, user } from "@/db/schema"
import { eq, count, and, like } from "drizzle-orm"

export type AdminOrg = {
  id: string
  name: string
  slug: string
  logo: string | null
  metadata: string | null
  createdAt: string
  memberCount: number
  ownerName: string | null
  ownerEmail: string | null
}

export async function GET(request: NextRequest) {
  const session = await getServerSession()

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const searchName = searchParams.get("searchName") || ""
  const limit = parseInt(searchParams.get("limit") || "10")
  const offset = parseInt(searchParams.get("offset") || "0")

  try {
    const whereClause = searchName
      ? like(organization.name, `%${searchName}%`)
      : undefined

    const orgs = await db
      .select()
      .from(organization)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(organization.createdAt)

    const totalResult = await db
      .select({ count: count() })
      .from(organization)
      .where(whereClause)

    const total = totalResult[0]?.count ?? 0

    const result: AdminOrg[] = await Promise.all(
      orgs.map(async (org) => {
        const memberCount = await db
          .select({ count: count() })
          .from(member)
          .where(eq(member.organizationId, org.id))

        const owner = await db
          .select({
            userName: user.name,
            userEmail: user.email,
          })
          .from(member)
          .innerJoin(user, eq(member.userId, user.id))
          .where(
            and(
              eq(member.organizationId, org.id),
              eq(member.role, "owner"),
            ),
          )
          .limit(1)

        return {
          id: org.id,
          name: org.name,
          slug: org.slug,
          logo: org.logo,
          metadata: org.metadata,
          createdAt: org.createdAt.toISOString(),
          memberCount: memberCount[0]?.count ?? 0,
          ownerName: owner[0]?.userName ?? null,
          ownerEmail: owner[0]?.userEmail ?? null,
        }
      }),
    )

    return NextResponse.json({ organizations: result, total })
  } catch (error) {
    console.error("Error fetching organizations:", error)
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession()

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { organizationId, name, slug, logo, taxId } = body

    if (!organizationId) {
      return NextResponse.json(
        { error: "organizationId is required" },
        { status: 400 },
      )
    }

    const metadata = JSON.stringify({ taxId: taxId || "" })

    await db
      .update(organization)
      .set({ name, slug, logo, metadata })
      .where(eq(organization.id, organizationId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating organization:", error)
    return NextResponse.json(
      { error: "Failed to update organization" },
      { status: 500 },
    )
  }
}
