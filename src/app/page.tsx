"use client";

import {MemoizedReactMarkdown} from "../components/providers/shared/Markdown";
// import {useTheme} from "next-themes";
import {ChangeEvent, FormEvent, useState} from "react";
import styled from "styled-components";
import {FcGraduationCap} from "react-icons/fc";
import {FcSms} from "react-icons/fc";

type Chat = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  // const {theme, setTheme} = useTheme();

  const [messages, setMessages] = useState<Chat[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setLoading] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setInput(e.target.value);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const userRequest: Chat = {
      role: "user",
      content: input,
    };

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          // 이전 히스토리를 보내야... 기억하고 그거에 맞춰서 대답이 옵니다.
          ...messages,
          userRequest,
        ],
      }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    let content = "";
    while (true) {
      const {done, value} = await reader.read();

      if (done) break;

      const decodedValue = decoder.decode(value);
      content += decodedValue;

      setMessages([...messages, userRequest, {role: "assistant", content: content}]);
    }

    setLoading(false);
  }

  return (
    <AllBox>
      {messages.map((message, index) => (
        <div key={index}>
          <RoleBox>
            {message.role === "user" && <FcGraduationCap style={{fontSize: 30}} />}
            {message.role === "assistant" && <FcSms style={{fontSize: 30}} />}
            <ContentBox>
              <MemoizedReactMarkdown>{message.content}</MemoizedReactMarkdown>
            </ContentBox>
          </RoleBox>
        </div>
      ))}
      <FormBox onSubmit={handleSubmit}>
        <InputBox placeholder="이곳에서 질문해보세요!" value={input} onChange={(e) => handleChange(e)} />
        <DiviserButton type="submit" disabled={!input || isLoading}>
          보내기
        </DiviserButton>
      </FormBox>
    </AllBox>
  );
}

const DiviserButton = styled.button`
  background-color: pink;
  border-radius: 8px;
  width: 20%;
`;

const RoleBox = styled.div`
  // background-color: orange;
  border: 1px solid orange;
  width: 100%;
  display: flex;
  border-radius: 8px;
  margin-bottom: 5px;
`;

const ContentBox = styled.div`
  // background-color: gray;
  // border: 1px solid gray;
  width: 100%;
`;

const InputBox = styled.input`
  // background-color: yellow;
  border: 1px solid yellow;
  border-radius: 8px;
  width: 100%;
`;

const FormBox = styled.form`
  // background-color: skyblue;
  // border: 1px solid skyblue;
  width: 100%;
  display: flex;
  bottom: 10px;
`;

const AllBox = styled.div`
  background-color: white;
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  height: 100vh;
`;
