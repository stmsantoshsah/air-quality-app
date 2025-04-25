// src/app/loading.tsx
import { Spin } from 'antd';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
        <Spin size="large" tip="Loading Page..." />
    </div>
  )
}