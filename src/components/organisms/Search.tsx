import { data } from "@/json/data";
import React, { Dispatch, SetStateAction, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdAdd, IoMdRefresh } from "react-icons/io";
import styled from "styled-components";
import Spinner from "../atoms/Spinner";
import SpinnerSmall from "../atoms/SpinnerSmall";

const SearchSt = styled.div`
  width: 100%;
  height: auto;

  .title {
    font-family: var(--motiva700);
    font-size: 0.9rem;
    color: #ffffff;
    margin-bottom: 0.5rem;
  }
  .search_container {
    width: 100%;
    height: 2rem;
    /* margin-bottom: 1rem; */
    display: grid;
    grid-template-columns: calc(100% - 8.5rem) 8rem;
    grid-template-rows: 2rem;
    gap: 0.5rem;
    /* margin-bottom: 1rem; */
    .container_icon_input {
      background: #27272a;
      border: 1px solid #2c2c2c;
      border-radius: 0.25rem;
      display: grid;
      grid-template-columns: 2.5rem calc(100% - 2.5rem);
      grid-template-rows: 100%;
      .seach_icon {
        width: 1rem;
        height: 1rem;
        justify-self: center;
        align-self: center;
        color: #9e9e9e;
      }
      .seach_input {
        font-family: var(--motiva400);
        font-size: 0.75rem;
        color: #ffffff;
        background: none;
        border-style: none;
        outline: none;
      }
      ::placeholder {
        color: #9e9e9e;
        opacity: 1; /* Firefox */
      }

      ::-ms-input-placeholder {
        /* Edge 12 -18 */
        color: #9e9e9e;
      }
    }
    .box_select {
      width: 100%;
      height: 100%;
      background: #27272a;
      border: 1px solid hsla(240 3.7% 15.9%);
      border-radius: 0.25rem;
      color: #bdbdbd;
      font-family: var(--motiva400);
      font-size: 0.75rem;
      padding: 0 1rem;
      padding: 0 2.5rem 0 1rem;
      outline: none;

      // !HIDE UGLY ARROW
      appearance: none;
      -moz-appearance: none;
      -webkit-appearance: none;
      background-image: url("/BottomArrowIcon.png");
      background-repeat: no-repeat;
      background-position: calc(100% - 0.8rem) center;
      background-size: 0.8rem;
      .box_option {
        color: #bdbdbd;
        font-family: var(--motiva400);
        font-size: 0.75rem;
      }
    }
    .button_prediction {
      border: 1px solid #e23670;
      background: #09090b;
      border-radius: 0.25rem;
      outline: none;
      font-family: var(--motiva500);
      font-size: 0.75rem;
      color: #d0d0d0;
      transition: 0.1s;

      &:hover {
        transition: 0.1s;
        background: #19191e;
      }
    }
    .refresh_button {
      border-radius: 0.25rem;
      background: #27272a;
      border: 1px solid #2c2c2c;
      color: #cbcbcb;
      padding: 0.3rem;
      transition: 0.1s;
      &:hover {
        transition: 0.1s;
        background: #171717;
        .sysIconRefresh {
          color: white;
        }
      }
      .sysIconRefresh {
        width: 100%;
        height: 100%;
        color: #a7a7a7;
      }
    }
    .button_search {
      /* border: 1px solid #2662d9; */
      background: #ffffff;
      border-radius: 0.25rem;
      outline: none;
      font-family: var(--motiva500);
      font-size: 0.75rem;
      color: #000000;
      transition: 0.1s;
      outline: none;
      border-style: none;

      &:hover {
        transition: 0.1s;
        background: #d9d9d9;
      }
    }
  }
`;
interface props {
  search: string;
  setSearch: (key: string) => void;
  analyzeImage: () => void;
  spinner: boolean;
  setSpinner: Dispatch<SetStateAction<boolean>>;
}
export default function Search(props: props) {
  return (
    <SearchSt>
      <p className="title">¿Puede mi mascota comer eso?</p>
      <div className="search_container">
        <select
          className="box_select"
          name="Available"
          value={props.search}
          onChange={(e) => props.setSearch(e.currentTarget.value)}
          required
        >
          <option className="box_option" value={""}>
            Elije un animal
          </option>
          {data.map((i) => (
            <option key={i} className="box_option" value={i}>
              {i}
            </option>
          ))}
        </select>

        <button className="button_search" type="button" onClick={() => props.analyzeImage()} disabled={props.spinner}>
          {props.spinner ? <SpinnerSmall /> : "Analizar"}
        </button>
      </div>
    </SearchSt>
  );
}
