package handler

import (
	"bytes"
	"encoding/csv"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/buysell-technologies/summer-internship-2024-backend/api/handler/request"
	usecaseRequest "github.com/buysell-technologies/summer-internship-2024-backend/api/usecase/request"
	"github.com/labstack/echo/v4"
)

// GetStocks godoc
//
//	@Summary		在庫一覧の取得
//	@Description	在庫一覧の取得
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			limit	query		int		false	"取得件数"	minimum(0)	example(10)
//	@Param			offset	query		int		false	"取得開始位置"	minimum(0)	example(0)
//	@Success		200	{object}	[]model.Stock
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/stocks [get]
func (h *Handler) GetStocks(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.GetStocksRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	stocks, err := h.Usecase.GetStocks(ctx, usecaseRequest.GetStocksRequest{
		StoreID: c.Get("store_id").(string),
		Limit:   req.Limit,
		Offset:  req.Offset,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.JSON(http.StatusOK, stocks)
}

// GetStock godoc
//
//	@Summary		在庫の取得
//	@Description	在庫の取得
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			id	path		int	true	"在庫ID"	minimum(1)
//	@Success		200	{object}	model.Stock
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/stocks/{id} [get]
func (h *Handler) GetStock(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.GetStockRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	stock, err := h.Usecase.GetStock(ctx, c.Get("store_id").(string), req.StockID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.JSON(http.StatusOK, stock)
}

// CreateStock godoc
//
//	@Summary		在庫の作成
//	@Description	在庫の作成
//	@Accept			json
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			req	body		request.CreateStockRequest	true	"在庫情報"
//	@Success		201	{object}	int
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/stocks [post]
func (h *Handler) CreateStock(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.CreateStockRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	stock, err := h.Usecase.CreateStock(ctx, usecaseRequest.CreateStockRequest{
		Name:     req.Name,
		Quantity: req.Quantity,
		Price:    req.Price,
		StoreID:  req.StoreID,
		UserID:   req.UserID,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.JSON(http.StatusCreated, stock)
}

// CreateBulkStock godoc
//
//	@Summary		在庫の一括作成
//	@Description	在庫の一括作成
//	@Accept			json
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			req	body		request.CreateBulkStockRequest	true	"在庫情報"
//	@Success		201	{object}	[]int
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/stocks/bulk [post]
func (h *Handler) CreateBulkStock(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.CreateBulkStockRequest
	if err := c.Bind(&req.Stocks); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	var stocks []usecaseRequest.CreateStockRequest
	for _, stock := range req.Stocks {
		stocks = append(stocks, usecaseRequest.CreateStockRequest{
			Name:     stock.Name,
			Quantity: stock.Quantity,
			Price:    stock.Price,
			StoreID:  stock.StoreID,
			UserID:   stock.UserID,
		})
	}

	stockIDs, err := h.Usecase.CreateBulkStock(ctx, stocks)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.JSON(http.StatusCreated, stockIDs)
}

// UpdateStock godoc
//
//	@Summary		在庫の更新
//	@Description	在庫の更新
//	@Accept			json
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			id		path		int						true	"在庫ID"		minimum(1)
//	@Param			req		body		request.UpdateStockRequest	true	"在庫情報"
//	@Success		200	{object}	model.Stock
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/stocks/{id} [put]
func (h *Handler) UpdateStock(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.UpdateStockRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	stock, err := h.Usecase.UpdateStock(ctx, usecaseRequest.UpdateStockRequest{
		StockID:  req.StockID,
		Name:     req.Name,
		Quantity: req.Quantity,
		Price:    req.Price,
		StoreID:  req.StoreID,
		UserID:   req.UserID,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.JSON(http.StatusOK, stock)
}

// DeleteStock godoc
//
//	@Summary		在庫の削除
//	@Description	在庫の削除
//	@Produce		json
//	@Security		ApiKeyAuth
//	@Param			id	path		int	true	"在庫ID"	minimum(1)
//	@Success		204	{string}	string
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/stocks/{id} [delete]
func (h *Handler) DeleteStock(c echo.Context) error {
	ctx := h.GetCtx(c)

	var req request.DeleteStockRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err).
			WithInternal(err)
	}

	err := h.Usecase.DeleteStock(ctx, c.Get("store_id").(string), req.StockID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	return c.NoContent(http.StatusNoContent)
}

// formatPriceWithComma formats a price with comma separator
func formatPriceWithComma(price int) string {
	if price < 1000 {
		return strconv.Itoa(price)
	}

	priceStr := strconv.Itoa(price)
	n := len(priceStr)
	result := make([]byte, 0, n+n/3)

	for i, char := range []byte(priceStr) {
		if i > 0 && (n-i)%3 == 0 {
			result = append(result, ',')
		}
		result = append(result, char)
	}

	return string(result)
}

// sanitizeCSVField removes potentially dangerous characters from CSV fields
func sanitizeCSVField(field string) string {
	// 危険な文字やSQLインジェクション的なパターンを除去
	// CSVインジェクション対策として、=, +, -, @で始まる値にプレフィックスを追加
	if len(field) > 0 {
		firstChar := field[0]
		if firstChar == '=' || firstChar == '+' || firstChar == '-' || firstChar == '@' {
			return "'" + field
		}
	}
	return field
}

// formatDateTime formats timestamp to YYYY/MM/DD HH:MM:SS format
func formatDateTime(t time.Time) string {
	return t.Format("2006/01/02 15:04:05")
}

// DownloadStocksCSV godoc
//
//	@Summary		在庫一覧のCSVダウンロード
//	@Description	在庫一覧をCSV形式でダウンロード
//	@Produce		text/csv
//	@Security		ApiKeyAuth
//	@Success		200	{string}	string	"CSV data"
//	@Failure		400	{object}	error
//	@Failure		500	{object}	error
//	@Router			/stocks/csv [get]
func (h *Handler) DownloadStocksCSV(c echo.Context) error {
	ctx := h.GetCtx(c)

	// デバッグ用ログ
	fmt.Printf("CSV Download Handler called - Store ID: %v\n", c.Get("store_id"))

	// 全てのデータを取得（大量データ対応のため制限値を高く設定）
	stocks, err := h.Usecase.GetStocks(ctx, usecaseRequest.GetStocksRequest{
		StoreID: c.Get("store_id").(string),
		Limit:   nil, // 制限なし（usecaseで最大50000に制限される）
		Offset:  nil,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	// CSVバッファを作成
	var buf bytes.Buffer
	writer := csv.NewWriter(&buf)

	// ヘッダー行を書き込み
	headers := []string{"ID", "商品名", "価格", "在庫数", "作成日時", "更新日時"}
	if err := writer.Write(headers); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	// データ行を書き込み
	for _, stock := range stocks {
		record := []string{
			strconv.Itoa(stock.ID),
			sanitizeCSVField(stock.Name),
			formatPriceWithComma(stock.Price),
			strconv.Itoa(stock.Quantity),
			formatDateTime(stock.CreatedAt),
			formatDateTime(stock.UpdatedAt),
		}
		if err := writer.Write(record); err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err).
				WithInternal(err)
		}
	}

	writer.Flush()
	if err := writer.Error(); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err).
			WithInternal(err)
	}

	// ファイル名を現在時刻で生成
	now := time.Now()
	filename := fmt.Sprintf("stocks_%s.csv", now.Format("20060102_150405"))

	// レスポンスヘッダーを設定
	c.Response().Header().Set("Content-Type", "text/csv; charset=utf-8")
	c.Response().Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", filename))
	fmt.Printf("Generated CSV filename: %s\n", filename)
	return c.Blob(http.StatusOK, "text/csv; charset=utf-8", buf.Bytes())
}
