export default function DashboardView({ Sidebar, MainContent }) {
  return (
    <div className='sm:flex'>
      <div className=' w-64'>
        <Sidebar />
      </div>
      <div className='flex-grow p-10 min-h-screen'>
        <MainContent />
      </div>
    </div>
  );
}
