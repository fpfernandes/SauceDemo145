import { test, expect } from '../utils/logger.js'
import { snap } from '../utils/snap.js'
 
// Funções de apoio
async function login_step(page){
    await page.goto('/')
 
    await expect(page).toHaveURL('/') // Verificação clássica
    await expect(page.locator('[data-test="login-button"]')).toHaveText('Login')
   
}
 
async function success_login_fill_step(page) {
    await page.locator('[data-test="username"]').fill('standard_user')
    await page.locator('[data-test="password"]').fill('secret_sauce')
}
 
async function success_login_click_step(page){
    await page.locator('[data-test="login-button"]').click()
 
    await expect(page).toHaveURL(/inventory\.html/)
    await expect(page.locator('[data-test="title"]')).toHaveText('Products')
       
}
 
async function add_to_cart_step(page){
    await page.locator('[data-test="shopping-cart-link"]').click()
    await expect(page).toHaveURL(/cart\.html/)
    await expect(page.locator('[data-test="title"]')).toHaveText("Your Cart")
    // await expect(page.locator('[data-test="title"]')).toContainText("Cart")
    await expect(page.locator('[data-test="item-quantity"]')).toHaveText("1")
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText("Sauce Labs Backpack")
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText("$29.99")
}
 
test.describe('SauceDemo - fluxo principal de compra', () => {
    test('Comprar Mochila Direto',
        async({ page }, testInfo) => {
        testInfo.setTimeout(testInfo.timeout + 15000)
       
        // Inicio do Passo 1
        await test.step('Acessar SauceDemo.com', async () => {
            await login_step(page)
            await snap(page, testInfo, 'TC001-Passo01-Home')            
        }) // fim do passo 1
 
        // Inicio do passo 2
        await test.step('Login com Sucesso', async () => {
            await success_login_fill_step(page) // preenche email e senha
            await snap(page, testInfo, 'TC001-Passo02A-Login_Preenchido')
            await success_login_click_step(page) // clique para entrar
            await snap(page, testInfo, 'TC001-Passo02B-Inventory')
        }) // fim do passo 2
 
        // Inicio do passo 3
        await test.step('Adicionar mochila no carrinho', async () => {
            const seletor_mochila = page.locator('.inventory_item').filter({ hasText: /Backpack/ })
            await seletor_mochila.getByRole('button', { name: /Add to cart/ }).click()
 
            await expect(page.locator('.shopping_cart_badge')).toHaveText('1')
            await snap(page, testInfo, 'TC001-Passo03-Mochila-Adicionada')
        }) // fim do passo 3
 
        await test.step('Ir para o carrinho', async () => {
            await add_to_cart_step(page)
            await snap(page, testInfo, 'TC001-Passo4-Carrinho-Conferido')
        })
 
    }) // fim do test 1
 
    // inicio do test 2
    test('Comprar Mochila Detalhes',
        async({ page }, testInfo) => {
        testInfo.setTimeout(testInfo.timeout + 15000)
       
        // Inicio do Passo 1
        await test.step('Acessar SauceDemo.com', async () => {
            await login_step(page)  
            await snap(page, testInfo, 'TC002-Passo01-Home')          
        }) // fim do passo 1
 
        // Inicio do passo 2
        await test.step('Login com Sucesso', async () => {
            await success_login_fill_step(page) // preenche email e senha
            await snap(page, testInfo, 'TC002-Passo02A-Login_Preenchido')
            await success_login_click_step(page) // clique para entrar
            await snap(page, testInfo, 'TC002-Passo02B-Inventory')
       
        }) // fim do passo 2
 
        // Inicio do passo 3
        await test.step('Abrir pagina da mochila e adicionar no carrinho', async () => {
            // Parte 3.1 - Abrir a pagina da mochila
            // açao // codigo de produto 4 = mochila
            await page.locator('[data-test="item-4-title-link"]').click()
            // verificações
            // Estamos na pagina certa?
            await expect(page).toHaveURL(/inventory-item\.html/)   // url
            await expect(page).toHaveTitle('Swag Labs')             // title (guia)
            await expect(page.locator('[data-test="back-to-products"]')).toHaveText('Back to products') // text
            // As informações do produto estão certas?
            await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText("Sauce Labs Backpack")
            await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText("$29.99")
           
            await snap(page, testInfo, 'TC002-Passo03_1-Inventory_Item')
 
            // Parte 3.2 - Adicionar produto no carrinho
            // ação
            await page.locator('[data-test="add-to-cart"]').click()
            // verificações
            await expect(page.locator('.shopping_cart_badge')).toHaveText('1')
            await snap(page, testInfo, 'TC002-Passo03_2-Mochila-Adicionada')
        }) // fim do passo 3
 
        await test.step('Ir para o carrinho', async () => {
            add_to_cart_step(page)
            await snap(page, testInfo, 'TC002-Passo4-Carrinho-Conferido')
        })
       
 
    }) // fim do test 2
}) // fim do describe
 