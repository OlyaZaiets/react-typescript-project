import { Outlet } from 'react-router-dom'
import './HomeLayout.scss';

export const HomeLayout = () => {
  return (
    <main className='home-layout'>
      <Outlet />
    </main>
  )
}