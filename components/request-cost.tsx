"use client"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface RequestCostProps {
  messageLength?: number
}

export default function RequestCost({ messageLength = 0 }: RequestCostProps) {
  // Базовая стоимость запроса
  const baseCost = 10

  // Дополнительная стоимость за каждые 100 символов
  const additionalCostPer100Chars = 2

  // Расчет стоимости запроса
  const calculateCost = (length: number) => {
    const additionalCost = Math.floor(length / 100) * additionalCostPer100Chars
    return baseCost + additionalCost
  }

  const cost = calculateCost(messageLength)

  return (
    <div className="flex items-center text-sm text-gray-500">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-center">
            <Info className="h-4 w-4 mr-1" />
            Стоимость запроса: {cost} тг
          </TooltipTrigger>
          <TooltipContent>
            <p>Базовая стоимость: {baseCost} тг</p>
            <p>Дополнительно за объем: {cost - baseCost} тг</p>
            <p className="text-xs mt-1">Стоимость зависит от длины сообщения</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
