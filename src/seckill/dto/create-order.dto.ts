import { IsNotEmpty, IsNumber, Min } from 'class-validator';
export class CreateSecKillOrder{
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  activityId: number;
}