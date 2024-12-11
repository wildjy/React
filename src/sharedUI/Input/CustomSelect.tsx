"use client";
import clsx from 'clsx'
import { cn } from "../common/cn";
import { cva, VariantProps } from "class-variance-authority";
import { SelectHTMLAttributes, FC, ChangeEvent } from "react";

const CustomSelectVariants = cva('',
  {
    variants: {
      size: {

      },
      mode: {

      }
    },
    defaultVariants: {

    },
  }
)