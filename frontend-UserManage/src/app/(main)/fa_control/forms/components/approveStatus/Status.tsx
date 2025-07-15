import { ApproveList } from "../../../service/type";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./breadcrumb"
import React from "react"

interface Props {
  approve: ApproveList[];
  totalPrice: number;
}

const level = [
  { workflowlevel: 0, name: 'BV' },
  { workflowlevel: 1, name: 'RSS' },
  { workflowlevel: 2, name: 'SM' },
  { workflowlevel: 3, name: 'DM' },
  { workflowlevel: 4, name: 'FM' },
  { workflowlevel: 5, name: 'MD' },
]

export default function Status({ approve, totalPrice }: Props) {
  if (!approve || approve.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <div className="flex flex-col md:flex-row gap-4 py-2">
        <BreadcrumbList>
          {approve.filter(res => res.limitamount >= totalPrice).length > 0 && (
            <BreadcrumbItem>
              <BreadcrumbLink>ผู้อนุมัติ: </BreadcrumbLink>
            </BreadcrumbItem>
          )}
          [{approve
            .filter(res => res.limitamount >= totalPrice)
            .slice()
            .map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  <BreadcrumbLink style={{ color: item.status === 1 ? 'blue' : 'black' }}>
                    {level.find(l => l.workflowlevel === item.workflowlevel)?.name}: {item.approverid}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            ))}]
        </BreadcrumbList>
      </div>
      {approve.filter(res => res.limitamount < totalPrice).length > 0 && (
        <div className="flex flex-col md:flex-row gap-4 py-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>ผู้ตรวจสอบ: </BreadcrumbLink>
            </BreadcrumbItem>
            [{approve
              .filter(res => res.limitamount < totalPrice)
              .slice()
              .map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    <BreadcrumbLink style={{ color: item.status === 1 ? 'blue' : 'black' }}>
                      {level.find(l => l.workflowlevel === item.workflowlevel)?.name}: {item.approverid}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </React.Fragment>
              ))}]
          </BreadcrumbList>
        </div>
      )}
    </Breadcrumb>
  )
}