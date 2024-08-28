import { router } from '@inertiajs/react'

export default function SignOut() {
  console.log('SIGNOTU')
  router.get('/frontend/logout/')
}
