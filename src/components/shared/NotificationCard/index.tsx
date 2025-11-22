import React from "react";
import { DiaryCard } from "./DiaryCard";
import { FormCard } from "./FormCard";

type DiaryNotification = {
  type: "diary";
  entry: { date: string; text: string } | null;
  onNavigate: (screen: any) => void;
};

type FormNotification = {
  type: "form";
  form: {
    title: string;
    institution: string;
    date: string;
    status?: string;
    color?: string;
  };
  onNavigate: (screen: any) => void;
};

type NotificationCardProps = DiaryNotification | FormNotification;

export function NotificationCard(props: NotificationCardProps) {
  if (props.type === "diary") {
    return <DiaryCard entry={props.entry} onNavigate={props.onNavigate} />;
  }
  if (props.type === "form") {
    return <FormCard form={props.form} onNavigate={props.onNavigate} />;
  }
  return null;
}

export default NotificationCard;
