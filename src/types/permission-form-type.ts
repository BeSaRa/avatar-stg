import { Permission } from '@/contracts/permission-contract'
import { PermissionGroupContract } from '@/contracts/permission-group-contract'
import { inject } from '@angular/core'
import { NonNullableFormBuilder } from '@angular/forms'

export function createPermissionForm() {
  const fb = inject(NonNullableFormBuilder)
  return fb.group({
    permissions: fb.array<PermissionGroup>([]),
  })
}

export function createPermissionGroup(permission: PermissionGroupContract) {
  const fb = inject(NonNullableFormBuilder)
  return fb.group({
    id: fb.control(permission.group_id),
    checked: fb.control(false),
    children: fb.array<PermissionChildGroup>(
      permission?.children.length ? permission.children.map(child => createChildPermissionGroup(child)) : []
    ),
  })
}

export function createChildPermissionGroup(permission: Permission) {
  const fb = inject(NonNullableFormBuilder)
  return fb.group({
    id: fb.control(permission.permission_id),
    checked: fb.control(false),
  })
}

export type PermissionGroup = ReturnType<typeof createPermissionGroup>
export type PermissionChildGroup = ReturnType<typeof createChildPermissionGroup>
