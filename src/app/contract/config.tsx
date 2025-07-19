import productionAbi from "./productionAbi.json";
import developmentAbi from "./developmentAbi.json";

export function getTokenContract(): `0x${string}` {
  return process.env.NEXT_PUBLIC_DEF_TOKEN;
}

export function getTokenSymbol() {
  return process.env.NEXT_PUBLIC_DEF_TOKEN_SYMBOL;
}

export function getTokenName() {
  return process.env.NEXT_PUBLIC_DEF_TOKEN_NAME;
}

export function getUSDTContract(): `0x${string}` {
  return process.env.NEXT_PUBLIC_USDT_TOKEN;
}

export function getUSDTSymbol() {
  return process.env.NEXT_PUBLIC_USDT_TOKEN_SYMBOL;
}

export function getUSDTName() {
  return process.env.NEXT_PUBLIC_USDT_TOKEN_NAME;
}

export function getMainnet() {
  return parseInt(process.env.NEXT_PUBLIC_CHAIN_ID);
}

export function getContractAbi() {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "production") {
    return productionAbi;
  }
  return developmentAbi;
}

export async function createReferral(referrer, referee) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/referrals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ referrer, referee }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Сервер вернул ошибку
      console.log("Ошибка при создании реферала:", data.error);
    }
  } catch (error) {
    console.log("Ошибка при выполнении запроса:", error);
  }
}

export async function getReferrals(address) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/referrals/${address}`,
      {
        method: "GET",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      // Сервер вернул ошибку
      console.error("Ошибка при получении рефералов:", data.error);
      return;
    }

    return data;
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
  }
}
